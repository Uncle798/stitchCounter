import { z } from "zod"

export const loginSchema = z.object({
   email: z.string().email().min(3).max(255).trim(),
});
export type LoginSchema = typeof loginSchema;

export const emailFormSchema = z.object({
   email: z.string().min(3).max(255).email().trim().toLowerCase(),
   emailConfirm: z.string().min(3).max(255).email().trim().toLowerCase(),
}).superRefine(({ email, emailConfirm}, context) =>{
   if(email !== emailConfirm) {
      context.addIssue({
         code: 'custom',
         message: 'Emails must match', 
         path: ['email']
      })
      context.addIssue({
         code: 'custom',
         message: 'Emails must match', 
         path: ['emailConfirm']
      })
   }
});
export type EmailFormSchema = typeof emailFormSchema;

export const nameFormSchema = z.object({
   familyName: z.string().min(1).max(255).trim(),
   givenName: z.string().min(1).max(255).trim(),
});
export type NameFormSchema = typeof nameFormSchema;

export const registerFormSchema = z.object({
   familyName: z.string().min(1).max(255).trim(),
   givenName: z.string().min(1).max(255).trim(),
   email: z.string().min(5).max(255),
   emailConfirm: z.string().min(5).max(255),
}).superRefine(({email, emailConfirm}, context)=>{
   if(emailConfirm !== email){
      context.addIssue({
         code: 'custom',
         message: 'Email must match email confirm', 
         path: ['email']
      })
      context.addIssue({
         code: 'custom',
         message: 'Email must match email confirm', 
         path: ['emailConfirm']
      })
   }
});
export type RegisterFormSchema = typeof registerFormSchema;

export const emailVerificationFormSchema = z.object({
   code: z.string().min(8).max(8)
});
export type EmailVerificationFormSchema = typeof emailVerificationFormSchema;

export const searchFormSchema = z.object({
   search: z.string().min(1).max(255),
});
export type SearchFormSchema = typeof searchFormSchema;

export const cuidIdFormSchema = z.object({
   cuid2Id: z.string().cuid2()
});
export type CuidIdFormSchema = typeof cuidIdFormSchema;

export const magicLinkFormSchema = z.object({
   email: z.string().min(5)
});
export type MagicLinkFormSchema  = typeof magicLinkFormSchema;

export const newProjectFormSchema = z.object({
   name: z.string().min(1)
})
export type NewProjectFormSchema = typeof newProjectFormSchema;

export const newRowFormSchema = z.object({
   projectId: z.string().cuid2(),
   rowNumber: z.number().positive()
});
export type NewRowFormSchema = typeof newRowFormSchema;

export const newPatternSchema = z.object({
   numberOfStitches: z.number().positive(),
   typeOfStitches: z.enum(['Single', 'Increase']),
   rowId: z.string().cuid2(),
});
export type NewPatternSchema = typeof newPatternSchema

export const projectDeleteFormSchema = z.object({
   projectId: z.string().cuid2(),
   projectName: z.string().min(1)
})
export type ProjectDeleteFormSchema = typeof projectDeleteFormSchema