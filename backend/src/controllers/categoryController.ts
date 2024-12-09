import { Request, Response } from "express";
import Category from "../models/Category";

/**
 * Fetches a category by its ID. Returns 401 if the user is not authenticated,
 * and 404 if the category is not found.
 *
 * @param {Request} req - The request object containing the category ID in the URL.
 * @param {Response} res - The response object used to send the response.
 */

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Find category by ID
    const category = await Category.findById(id);

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    res.status(200).json(category);
    return;
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: "Error fetching category" });
    return;
  }
};

/**
 * Creates a new category. Returns 401 if the user is not authenticated,
 * 400 if the category name is not provided, and 400 if the category already exists.
 *
 * @param {Request} req - The request object containing the category name in the body.
 * @param {Response} res - The response object used to send the response.
 */

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Validate that the name field is provided
    if (!name) {
      res.status(400).json({ message: "Category Name is required" });
      return;
    }

    // Check if the category already exists for the same user
    const existingCategory = await Category.findOne({
      name: name.trim(),
      createdBy: req.user._id, // Assuming `req.user` contains the user's ID
    });

    if (existingCategory) {
      res
        .status(400)
        .json({ message: "Category already exists for this user" });
      return;
    }

    console.log(req.user);
    // Create and save the new category with user ID
    const category = new Category({
      name: name.trim(),
      createdBy: req.user.id,
    });
    await category.save();

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Error creating category" });
  }
};

/**
 * Fetches all categories with pagination support. Returns 500 if there is an error fetching categories.
 *
 * @param {Request} req - The request object containing pagination parameters (page and limit).
 * @param {Response} res - The response object used to send the response.
 */

export const getCategories = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const categories = await Category.find().skip(skip).limit(Number(limit));
    const totalCategories = await Category.countDocuments();

    res.status(200).json({ categories, totalCategories });
    return;
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories" });
    return;
  }
};

/**
 * Updates a category by its ID. Returns 401 if the user is not authenticated,
 * 400 if the new category name is provided, 404 if the category is not found,
 * and 400 if the category name already exists.
 *
 * @param {Request} req - The request object containing the category ID and the new name in the body.
 * @param {Response} res - The response object used to send the response.
 */

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!name) {
      res.status(400).json({ message: "Category Name is required" });
      return;
    }

    const category = await Category.findOne({
      _id: id,
      createdBy: req.user.id,
    });

    if (!category) {
      res.status(404).json({ message: "Category not found or not authorized" });

      return;
    }

    const existingCategory = await Category.findOne({
      name: name.trim(),
      _id: { $ne: id },
    });

    if (existingCategory) {
      res.status(400).json({ message: "Category name already exists" });
      return;
    }

    // Update the category with the new name
    category.name = name.trim();
    await category.save(); // Save the updated category

    // Return the updated category
    res.status(200).json(category);
    return;
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Error updating category" });
  }
};

/**
 * Deletes a category by its ID. Returns 401 if the user is not authenticated,
 * 403 if the user is not the owner of the category, and 404 if the category is not found.
 *
 * @param {Request} req - The request object containing the category ID in the URL.
 * @param {Response} res - The response object used to send the response.
 */

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    console.log("id for deleteting user ", id);
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Find the category by ID
    const category = await Category.findById(id);

    console.log("category deletete ", category);
    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    // Check if the user is the creator of the category
    if (category.createdBy.toString() !== req.user.id) {
      res.status(403).json({
        message: "Forbidden: You are not authorized to delete this category",
      });
      return;
    }

    // Delete the category
    await Category.findByIdAndDelete(id);

    res.status(200).json({ message: "Category deleted successfully" });
    return;
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Error deleting category" });
    return;
  }
};
