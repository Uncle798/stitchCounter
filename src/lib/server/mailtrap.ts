import { PUBLIC_URL } from "$env/static/public";
import type {  User } from "@prisma/client";
import { MailtrapClient } from "mailtrap";
import dayjs from "dayjs";
import { MAILTRAP_TOKEN } from "$env/static/private";


const currencyFormatter = new Intl.NumberFormat('en-us', {style: 'currency', currency:'USD'})
export const mailtrap = new MailtrapClient({token:MAILTRAP_TOKEN})

const sender = {
   name: 'computer@bransonschlegel.com',
   email: 'computer@bransonschlegel.com',
}
export async function sendVerificationEmail(verificationCode:string, email:string) {
   try {
      const response = await mailtrap.send({
         from:sender,
         to: [{email}],
         subject: "Please verify your email",
         html: `Verification code: ${verificationCode}`
      }).catch((err) =>{
         console.error(err);
      })
      return response;
   } catch (error) {
      console.error(error)
   }
}

export async function sendMagicLinkEmail(magicLink:string, email:string) {
   try {
      
      const response = await mailtrap.send({
         from:sender,
         to: [{email}],
         subject: `Login link from Stitch counter `,
         html: `Please click this link or paste it into your browser \
         to log in: <a href="${PUBLIC_URL}/login/magicLink/${magicLink}">${PUBLIC_URL}/login/magicLink/${magicLink}</a>`
      }).catch((err) =>{
         console.error(err);
      })
      return response;
   } catch (error) {
      console.error(error)
   }
}

