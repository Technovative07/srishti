import sendMail from "./sendMail.js"
import schedule from "node-schedule"
const notify=async({userId,email,type,message,subject="Notification",scheduleTime=null})=>{
    if(!scheduleTime){
        await sendMail({userId,email,type,message,subject})
    }else{
        schedule.scheduleJob(scheduleTime,async()=>{
            await sendMail({userId,email,type,message,subject})
        })
    }
}
const sendNotificationsNow=async( email,type,message,subject)=>{
     console.log(`Sending ${type} notification to ${email}: ${message}`);

  if (email) {
    await sendMail(email, subject, `<p>${message}</p>`);
  }

}
export {notify,}