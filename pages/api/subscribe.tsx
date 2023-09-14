import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { Resend } from 'resend'
import { db } from 'src/db'
import { subscribers } from 'src/schema'

const resend = new Resend(process.env.RESEND_API_KEY)

type ResponseData =
  | {
      success: true
    }
  | {
      success: false
      userFacingError: string
    }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const emailSchema = z.coerce.string().email()
  const email = emailSchema.safeParse(req.body.email)
  if (!email.success) {
    return res.status(400).json({
      success: false,
      userFacingError: 'Email is not valid',
    })
  }

  if (!email) {
    return res.status(400).json({
      success: false,
      userFacingError: 'Email is not present',
    })
  }

  try {
    await db
      .insert(subscribers)
      .values({ email: email.data })
      .onConflictDoNothing()

    resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'giovanni.benussi@usach.cl',
      subject: 'New subscriber! 🎉',
      html: `<p>${email.data} just subscribed to your newsletter!</p>`,
    })

    return res.status(200).json({
      success: true,
    })
  } catch (e: any) {
    console.error(e)
    return res.status(500).json({
      success: false,
      userFacingError: 'There has been an error',
    })
  }
}
