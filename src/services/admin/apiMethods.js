import { apiCall } from "./apiCalls";
import { userUrl,adminUrl } from "../../const/routes";

export const adminRegister=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("post",userUrl.adminSignup,userData).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const adminLogin=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("post",userUrl.adminLogin,userData).then((response)=>{
                resolve(response)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const fetchPatients=()=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("get",adminUrl.fetch_patients).then((response)=>{
                resolve(response)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const fetchDoctors=()=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("get",adminUrl.fetch_doctors).then((response)=>{
                resolve(response)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const blockUnblockDoctor=(id,status)=>{
    return new Promise((resolve,reject)=>{
        try{
            const url=adminUrl.blockUnblockdoctor(id)
            const data={status:status}
            apiCall("patch",url,data).then((response)=>{
                resolve(response)
            }).catch((error)=>{
                reject(error)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const blockUnblockPatient=(id,status)=>{
    return new Promise((resolve,reject)=>{
        try{
            const url=adminUrl.blockUnblockpatient(id)
            const data={status:status}
            apiCall("patch",url,data).then((response)=>{
                resolve(response)
            }).catch((error)=>{
                reject(error)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const adminotpverify=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("post",adminUrl.adminotpverify,userData).then((response)=>{
                resolve(response)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const adminforgotpassword=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("post",adminUrl.adminforgotpassword,userData).then((response)=>{
                resolve(response)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const adminresetpassword=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("post",adminUrl.adminresetpassword,userData).then((response)=>{
                resolve(response)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const verifyDoctorDocuments=(id)=>{
    return new Promise((resolve,reject)=>{
        try{
            const url=adminUrl.verifyDoctorDocuments(id)
            apiCall("patch",url).then((response)=>{
                resolve(response)
            }).catch((error)=>{
                reject(error)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const bookingList=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("get",adminUrl.BookingList,{params:userData}).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(err){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const Bookings=()=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("get",adminUrl.Bookings).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(err){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const updateFee=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("patch",adminUrl.updateFee,userData).then((response)=>{
                resolve(response)
            }).catch((error)=>{
                reject(error)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const addExpertise=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("post",adminUrl.addExpertise,userData).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const expertise=()=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("get",adminUrl.expertise).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(err){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const editExpertise=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("patch",adminUrl.editExpertise,userData).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(err){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}