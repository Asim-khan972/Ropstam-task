import { Request, Response } from "express";
import Car from "../models/Car";
import Category from "../models/Category";

/**
 * Fetches a car by its ID, including its associated category and creator details.
 * Returns 401 if the user is not authenticated, and 404 if the car is not found.
 *
 * @param {Request} req - The request object containing the car ID in the URL parameters.
 * @param {Response} res - The response object used to send the response.
 */

export const getCarById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Find car by ID and populate category and createdBy fields
    const car = await Car.findById(id)
      .populate("category", "name")
      .populate("createdBy", "name email");

    if (!car) {
      res.status(404).json({ message: "Car not found" });
      return;
    }

    res.status(200).json(car);
    return;
  } catch (error) {
    console.error("Error fetching car:", error);
    res.status(500).json({ message: "Error fetching car" });
    return;
  }
};

/**
 * Creates a new car by validating input fields, checking if the car exists,
 * and associating the car with the authenticated user.
 * Returns 401 if the user is not authenticated and 400 if the car already exists.
 *
 * @param {Request} req - The request object containing the car details in the body.
 * @param {Response} res - The response object used to send the response.
 */

export const createCar = async (req: Request, res: Response) => {
  try {
    const { category, color, model, make, registrationNo } = req.body;

    // Check if the user is authenticated
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Validate required fields
    if (!category || !color || !model || !make || !registrationNo) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // Check if the registration number already exists
    const existingCar = await Car.findOne({
      registrationNo: registrationNo.trim(),
    });
    if (existingCar) {
      res
        .status(400)
        .json({ message: "Car with this registration number already exists" });
      return;
    }

    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      res.status(400).json({ message: "Invalid category ID" });
      return;
    }

    // Create a new car and associate it with the user
    const car = new Car({
      category,
      color,
      model,
      make,
      registrationNo: registrationNo.trim(),
      createdBy: req.user.id, // Associate with authenticated user
    });

    await car.save();

    res.status(201).json(car);
  } catch (error) {
    console.error("Error creating car:", error);
    res.status(500).json({ message: "Error creating car" });
  }
};

/**
 * Retrieves a list of cars with optional pagination, sorting, and filtering.
 * Returns the cars along with the total number of cars.
 *
 * @param {Request} req - The request object containing query parameters for pagination, sorting, and filtering.
 * @param {Response} res - The response object used to send the response.
 */

export const getCars = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "registrationNo",
      sortOrder = "asc",
    } = req.query;

    const sortField = sort as string;
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    console.log("Sorting by:", req.query.sort, "Order:", sortOrder);

    const cars = await Car.find()
      .populate("category", "name")
      .populate("createdBy", "name email")
      .sort({ [sortField]: sortDirection })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const totalCars = await Car.countDocuments();

    res.status(200).json({ cars, totalCars });
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).json({ message: "Error fetching cars" });
  }
};

/**
 * Updates an existing car by validating input fields, checking if the user is the owner,
 * and ensuring the car's registration number is unique.
 * Returns 401 if the user is not authenticated, 403 if the user is not the owner,
 * and 404 if the car is not found.
 *
 * @param {Request} req - The request object containing the car ID in the URL and updated details in the body.
 * @param {Response} res - The response object used to send the response.
 */

export const updateCar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log("car id is ", id);
    const { category, color, model, make, registrationNo } = req.body;

    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Validate required fields
    if (!category || !color || !model || !make || !registrationNo) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // Check if the registration number already exists
    // Find the car by ID and check if the current user is the creator
    const car = await Car.findById(id);

    if (!car) {
      res.status(404).json({ message: "Car not found" });
      return;
    }

    if (car.createdBy.toString() !== req.user.id) {
      res.status(403).json({
        message: "Forbidden: You are not authorized to edit this car",
      });
      return;
    }

    const existingCar = await Car.findOne({
      registrationNo: registrationNo.trim(),
      _id: { $ne: id },
    });
    console.log("existingCar", existingCar);

    if (existingCar) {
      res
        .status(400)
        .json({ message: "Car with this registration number already exists" });
      return;
    }

    console.log("cateogry , ", category);
    const existingCategory = await Category.findById(category);

    console.log("existingCategory", existingCategory);
    if (!existingCategory) {
      res.status(400).json({ message: "Invalid category ID" });
      return;
    }

    const updatedCar = await Car.findByIdAndUpdate(
      id,
      { category, color, model, make, registrationNo },
      { new: true },
    );
    res.status(200).json(updatedCar);
    return;
  } catch (error) {
    res.status(500).json({ message: "Error updating car" });
    return;
  }
};

/**
 * Deletes a car by its ID. The user must be the owner of the car to delete it.
 * Returns 401 if the user is not authenticated and 403 if the user is not the owner.
 *
 * @param {Request} req - The request object containing the car ID in the URL.
 * @param {Response} res - The response object used to send the response.
 */

export const deleteCar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const car = await Car.findById(id);

    if (!car) {
      res.status(404).json({ message: "Car not found" });
      return;
    }

    // Check if the user is the owner of the car
    if (car.createdBy.toString() !== req.user.id) {
      res.status(403).json({
        message: "Forbidden: You are not authorized to delete this car",
      });
      return;
    }

    // Delete the car
    await Car.findByIdAndDelete(id);

    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error("Error deleting car:", error);
    res.status(500).json({ message: "Error deleting car" });
    return;
  }
};
