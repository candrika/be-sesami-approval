// src/routes/index.ts
import express from "express";
import { Login } from "../controllers/Auth";
import { Store, Show, Update, Index, updateRole, resetPassword, Verify, Profile } from "../controllers/User";
import {auth, authorize} from '../middleware'
import { destory, index, store, update, updateStatus } from "../controllers/WorkLeave";

const router = express.Router();

//main route
router.post("/api/register", Store);
router.post("/api/login", Login);
router.get('/api/user/:id',auth, Show);
router.get('/api/profile',auth, Profile);
router.put('/api/profile/:id/update',auth, Update);

//routes admin
router.post("/api/admin/create/user", auth, authorize(['Admin']), Store);
router.get("/api/admin/users", auth, authorize(['Admin']), Index);
router.get("/api/admin/user/:id", auth, authorize(['Admin']), Show);
router.patch("/api/admin/user/:id/role", auth, authorize(['Admin']), updateRole)
router.patch("/api/admin/user/:id/reset-password", auth, authorize(['Admin']), resetPassword)
router.put('/api/admin/user/:id/update',auth, Update);
router.get("/api/admin/leaves", auth, authorize(['Verifikator']), index);

//route verifikator
router.get("/api/verifikator/users", auth, authorize(['Verifikator']), Index);
router.get("/api/verifikator/user/:id", auth, authorize(['Verifikator']), Show);
router.patch("/api/verifikator/user/:id/verify", auth, authorize(['Verifikator']), Verify)
router.put('/api/verifikator/user/:id/update',auth, Update);
router.patch("/api/verifikator/leave/:id/status", auth, authorize(['Verifikator']), updateStatus)
router.get("/api/verifikator/leaves", auth, authorize(['Verifikator']), index);

//route user reguler
router.get("/api/leaves", auth, authorize(['User']), index);
router.get("/api/leave/:id", auth, authorize(['User']), index);
router.post("/api/leave", auth, authorize(['User']), store);
router.put("/api/leave/:id", auth, authorize(['User']), update);
router.delete("/api/leave/:id", auth, authorize(['User']), destory);
router.patch("/api/leave/:id/update-status", auth, authorize(['User']), updateStatus)

export default router;
