// import type { NextApiRequest, NextApiResponse } from 'next';
// import { getUserFromSession, destroySession } from '@/lib/auth'; // You need a function to destroy the session
// import db from '@/lib/db';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     if (req.method !== 'DELETE') {
//         return res.status(405).json({ message: 'Method Not Allowed' });
//     }

//     try {
//         // 1. Authenticate the user
//         const user = await getUserFromSession(req);
//         if (!user) {
//             return res.status(401).json({ message: 'Unauthorized' });
//         }

//         // 2. Perform a cascade delete in your database.
//         // The exact implementation depends on your schema.
//         // For SQL databases with foreign key constraints, `ON DELETE CASCADE` is ideal.
//         // For others, you must manually delete related data first.
        
//         // Example with Prisma (it can be configured to handle cascade deletes):
//         await db.user.delete({
//             where: { id: user.id },
//         });

//         // 3. Invalidate the user's session/token to log them out
//         await destroySession(res);

//         // 4. Send a success response
//         res.status(200).json({ message: 'Account deleted successfully' });

//     } catch (error) {
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// }