import { apiCall } from "./apiCalls";
import { doctorUrl, userUrl } from "../../const/routes";

export const doctorpostRegister=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("post",userUrl.doctorregister,userData).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const doctorotpverify=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("post",userUrl.doctorotpverify,userData).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const doctorforgotpassword=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("post",userUrl.doctorforgotpassword,userData).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const doctorresetpassword=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("post",userUrl.doctorresetpassword,userData).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const doctorLogin=(userData)=>{

    return new Promise((resolve,reject)=>{
        try{
            apiCall("post",userUrl.doctorLogin,userData).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const editDoctor=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("put",doctorUrl.editDoctor,userData).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const uploadDocuments=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("put",doctorUrl.uploadDocuments,userData).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const deleteDocument=(email,index)=>{
    return new Promise((resolve,reject)=>{
        try{
            const url=doctorUrl.deleteDocument(email,index)
            apiCall("put",url).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const slotUpdate=(userData)=>{   
    console.log(userData);
    
    return new Promise((resolve,reject)=>{
        try{
            apiCall("post",doctorUrl.slotUpdate,userData).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(err){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const fetchSlots=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("get",doctorUrl.fetchSlots,{params:userData}).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(err){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const drAppointments=(date,doctorId)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("get",doctorUrl.fetchAppointments,{params:{date,doctorId}}).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(err){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const postPrescription=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("post",doctorUrl.postPrescription,userData).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(err){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const fetchDoctor=(id)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("get",doctorUrl.fetchDoctor,{params:id}).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(err){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const patientHistory=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("get",doctorUrl.patientHistory,{params:userData}).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(err){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const fetchAllAppointments=(doctorId)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("get",doctorUrl.fetchAllAppointments,{params:{doctorId}}).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(err){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const updateBooking=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("patch",doctorUrl.updateBooking,userData).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const slotUpdateDay=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("patch",doctorUrl.slotUpdateDay,userData).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}