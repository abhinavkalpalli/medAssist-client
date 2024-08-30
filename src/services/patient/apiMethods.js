import { apiCall } from "./apiCalls";
import { authUrl, userUrl } from "../../const/routes";

export const postRegister=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("post",userUrl.register,userData).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const otpverify=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("post",userUrl.otpverify,userData).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const forgotpassword=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("post",userUrl.forgotpassword,userData).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const resetpassword=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("post",userUrl.resetpassword,userData).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const patientLogin=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("post",userUrl.patientLogin,userData).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const editPatient=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("put",userUrl.editPatient,userData).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                console.log('autherr',err);
                reject(err)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const resendOtp=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("get",authUrl.resendOtp,{params:userData}).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const findDoctors=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("get",userUrl.fetchDoctors,{params:userData}).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(err){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const bookings=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("get",userUrl.getBookings,{params:userData}).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(err){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const postBooking=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("post",userUrl.postBooking,userData).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const yourBooking=(patientId)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("get",userUrl.yourBooking(patientId)).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(err){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const cancelAppointment=(Id)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("get",userUrl.cancelAppointment(Id)).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(err){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const fetchPatient=(id)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("get",userUrl.fetchPatient,{params:id}).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(err){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const setFavouriteDoctor=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("patch",userUrl.setFavourite,userData).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}
export const postRating=(userData)=>{
    return new Promise((resolve,reject)=>{
        try{
            apiCall("post",userUrl.postRating,userData).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        }catch(error){
            resolve({status:500,message:'Something went wrong'})
        }
    })
}