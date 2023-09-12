import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@libsql/client'
import { z } from 'zod'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const client = createClient({
  url: process.env.TURSO_URL as string,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

type ResponseData =
  | {
      success: true
    }
  | {
      success: false
      errorMessage: string
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
      errorMessage: 'Email is not valid',
    })
  }

  if (!email) {
    return res.status(400).json({
      success: false,
      errorMessage: 'Email is not present',
    })
  }

  try {
    await client.execute({
      sql: 'insert or replace into subscribers (email) values (?)',
      args: [email.data],
    })

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
      errorMessage: 'There has been an error',
    })
  }
}
