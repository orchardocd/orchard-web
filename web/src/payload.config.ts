import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import nodemailer from 'nodemailer'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Categories } from './collections/Categories.js'
import { Documents } from './collections/Documents.js'
import { Media } from './collections/Media.js'
import { Pages } from './collections/Pages.js'
import { People } from './collections/People.js'
import { Posts } from './collections/Posts.js'
import { Speakers } from './collections/Speakers.js'
import { Studies } from './collections/Studies.js'
import { Users } from './collections/Users.js'
import { Webinars } from './collections/Webinars.js'
import { Navigation } from './globals/Navigation.js'
import { SiteSettings } from './globals/SiteSettings.js'

const fromAddress = process.env.EMAIL_FROM_ADDRESS || 'info@orchardocd.org'
const fromName = process.env.EMAIL_FROM_NAME || 'Orchard OCD'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Pages,
    Posts,
    Studies,
    Webinars,
    People,
    Speakers,
    Categories,
    Media,
    Documents,
    Users,
  ],
  globals: [SiteSettings, Navigation],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  email: nodemailerAdapter(
    process.env.SMTP_HOST
      ? {
          defaultFromAddress: fromAddress,
          defaultFromName: fromName,
          transportOptions: {
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            secure: process.env.SMTP_PORT === '465',
            auth:
              process.env.SMTP_USER && process.env.SMTP_PASS
                ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
                : undefined,
          },
        }
      : {
          defaultFromAddress: fromAddress,
          defaultFromName: fromName,
          skipVerify: true,
          transport: nodemailer.createTransport({ jsonTransport: true }),
        },
  ),
  plugins: [],
})
