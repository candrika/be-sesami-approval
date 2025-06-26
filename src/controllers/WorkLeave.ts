import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export const index = async(req, res)=>{
    try {
        const leaves = await prisma.leave.findMany();

        if(leaves.length === 0) 
            return res.status(404).json({message:'Data izin tidak tersedia'})

        return res.status(200).json({data:leaves,message:'Data izin tersedia'})

    } catch (err) {
        return res.status(500).json({message:'Data Izin error',error:err})   
    }
}

export const show = async(req, res)=>{
    try {
        const leave = await prisma.leave.findUnique({where:{id:req.params.id}});

        if(leave.id === null) 
            return res.status(404).json({message:`Izin dengan dengan id ${req.params.id} tidak ditemukan atau telah dihapus dari database`})

        return res.status(200).json({data:leave,message:'Data izin tersedia'})

    } catch (err) {
       return res.status(500).json({message:'Data Izin error',error:err})
    }
}


export const store = async(req, res)=>{

    const {title, description} = req.body
    const userId = (req as any).user.id;

    try{
        const leave = await prisma.leave.create({
            data:{
                title, 
                description, 
                user:{
                    connect:{id:userId}
                }
            } as Prisma.LeaveCreateInput
        })

        if(!leave) return res.status(400).json({message:'Pengajuan izin gagal'})
        
        return res.status(201).json({
            message:"Pengajuan izin berhasil"
        })

    }catch(err){
        return res.status(500).json({message:'Pengajuan izin error',error:err})
    }
}

export const update = async(req, res)=>{
    const {id} = req.params
    const {title, description}=req.body
    
    try {
       
        const leave = await prisma.leave.findUnique({where:{id:id}})
        
        if (!leave) {
            return res.status(404).json({
                message: `Data pengajuan dari id ${id} tidak ditemukan di database`
            });
        }
        
        const updateLeave = await prisma.leave.update({
            where:{
                id:id
            },
            data:{
                title:title ? title:leave.title,
                description:description ? description:leave.description,
            }         
        })

        if(!updateLeave) 
           return res.status(400).json({message:'Gagal memperbarui pengajuan'})

        return res.status(200).json({message:'Izin berhasil diperbarui'})
    } catch (err) {
        return res.status(500).json({message:'Pembaruan izin error',error:err})
    }
}

export const destory = async(req, res)=>{
    const {id} = req.params

    try {

        const leave = await prisma.leave.findFirst({where:{id:id}})
        
        if(!leave){
            return res.status(404).json({message:`Data pengajuan dari id ${id} sudah dihapus data database`})
        }

        const deleteLeave = await prisma.leave.delete({
            where:{
                id:id
            }
        })

        if(!deleteLeave) res.status(400).json({message:'Gagal menghapus izin'})
    
        return res.status(200).json({message:'Berhasil penghapus pengajuan'})    

    } catch (err) {
       return res.status(500).json({message:"Penghapusan izin error",error:err})
    }
}

export const updateStatus = async(req, res)=>{

    const {id} = req.params
    const user = (req as any).user;
    
    try {

        const leave = await prisma.leave.findFirst({where:{id:id}})
        
        if(!leave){
           return res.status(404).json({message:`Data pengajuan dari id ${id} tidak ada`})
        }

        if((user.role !='Verifikator' && req.body.status =='Terima') ||(user.role !='Verifikator' && req.body.status =='Tolak')){
           return res.status(400).json({message:'Anda tidak ubah staus jadi terima atau tolak'})
        }

        const updateStatus = await prisma.leave.update({
            where:{
                id:id
            },
            data:{
                status:req.body.status
            }
        })

        if(!updateStatus) 
            return res.status(400).json({message:"Gagal memperbarui status"})

        res.status(200).json({
            message:"Memperbarui status berhasil"
        })    
    } catch (err) {
       return res.status(500).json({message:"Penghapusan izin error",error:err})
    }
}