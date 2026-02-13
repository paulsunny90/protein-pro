import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
    getUserAddresses,
    getAddressById,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getDefaultAddress
} from "../controllers/address.controller";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get default address (must be before /:id route)
router.get("/default", getDefaultAddress);

// Get all addresses for the authenticated user
router.get("/", getUserAddresses);

// Get a single address by ID
router.get("/:id", getAddressById);

// Create a new address
router.post("/", createAddress);

// Update an existing address
router.put("/:id", updateAddress);

// Set an address as default
router.patch("/:id/set-default", setDefaultAddress);

// Delete an address
router.delete("/:id", deleteAddress);

export default router;
