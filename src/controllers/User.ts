import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs'
import { userSchema, idParamSchema, updateUserSchema, resetPasswordSchema, updateRoleSchema } from "../validators/userValidator";

const prisma = new PrismaClient()

export const Store = async(req, res)=>{
   const body = userSchema.parse(req.body); // ✅ Validasi di sini

    try{
        const hashed = await bcrypt.hash(body.password, 12);
        console.log(req.body)

        const user = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                password: hashed,
                role: body.role ?? "User",
            },
        });
        
        return res.status(201).json({
            message:'User berhasil didaftarkan',
            user
        })
    }catch(err){
        return res.status(500).json({ message: "Register error", error: err });
    }
}

export const Show = async(req, res)=>{
    const {id} = req.params

    try{
        const user = await prisma.user.findFirst({where:{id}})
        if(!user) return res.status(404).json({message:'Pengguna tidak ditemukan'})
        
        return res.status(200).json({data:user, message:'Pengguna ditemukan'})    
    }catch(err){
        return res.status(500).json({ message: "Register error", error: err });
    }
}

export const Update = async(req, res)=>{
    const {id} = req.params
    const {name, email, password}= req.body

    try{

        const user = await prisma.user.findUnique({where:{id:id}})

        const updateProfile = await prisma.user.update({
            where:{
                id:id
            }
            ,data:{
                name:name ? name:user.name,
                email:email ? email:user.email,
                password:password ? password:user.password,
            }
        })

         if(!updateProfile) return res.status(400).json({message:'Gagal update profile'})
        
        return res.status(200).json({message:'Update profile berhasil'})

    }catch(err){
        return res.status(500).json({ message: "Update profile", error: err });
    }
}

export const updateRole = async(req, res)=>{
    const {id} = req.params
    const {role}=req.body
    const user = (req as any).user;
    
    if(user.role!='Admin'){
        return res.status(400).json({message:'Anda tidak mengubah role pengguna'})
    }

    try{
       // Update nama user berdasarkan email
        const updatedUser = await prisma.user.update({
            where: {
                id:id,
            },
            data: {
                role: role,
            },
        });

        if(!updatedUser) return res.status(400).json({message:'Gagal update role pengguna'})
        
        return res.status(200).json({message:'Role pengguna berhasil diupdate'})
    }catch(err){
        return res.status(500).json({ message: "Ubah role pengguna error", error: err });
    }
}

export const Index = async(req, res)=>{
    const userList = []

    try{

        const users = await prisma.user.findMany({
            where:{
                NOT:{
                    role:'Admin'
                } 
            }
        });
        // console.log(users)
        if(!users) return res.status(404).json({message:"Daftar pengguna masih kosong"})

        users.map((data, i)=>{
            userList.push({
                id:data.id,
                name:data.name,
                email:data.email,
                role:data.role,
                verified:data.verified ? 'Verified':'Unverified'
            })
        })

        // console.log(userList)
        
        return res.status(200).json({message:'Daftar pengguna ada',data:userList})
    }catch(err){
        return res.status(500).json({ message: "Daftar pengguna", error: err });
    }
}

export const resetPassword = async(req, res)=>{
    const {id} = req.params
    const {password}=req.body
   
    try{
       // Update nama user berdasarkan email
        const reset = await prisma.user.update({
            where: {
                id:id,
            },
            data: {
                password: await bcrypt.hash(password, 12),
            },
        });

        if(!reset) return res.status(400).json({message:'Reset/Pembaruan password penguna gagal'})
        
        return res.status(200).json({message:'Password pengguna berhasil direset/diperbarui'})
    }catch(err){
        return res.status(500).json({ message: "Reset/Pembaruan password pengguna error", error: err });
    }
}

export const Verify = async(req, res)=>{
    const {id} = req.params
    const user = (req as any).user;

    if(user.role !='Verifikator') res.status(400).json({message:'Anda tidak memverifikasi pengguna'})

    try{
       // Update nama user berdasarkan email
        const reset = await prisma.user.update({
            where: {
                id:id,
            },
            data: {
                verified: true,
            },
        });

        if(!reset) res.status(400).json({message:'Verifikasi password penguna gagal'})
        
        return res.status(200).json({message:'Proses verifikasi pengguna berhasil'})
    }catch(err){
        return res.status(500).json({ message: "Proses verifikasi pengguna error", error: err });
    }
}

export const Profile = async(req, res)=>{

    const user = (req as any).user;
    return res.status(200).json(user)
}

