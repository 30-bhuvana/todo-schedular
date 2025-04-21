import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt    from 'jsonwebtoken';

import { connect } from '../../../../lib/mongo';

import User   from '../../../../models/User';

export async function POST(request) {
  const { email, password } = await request.json();
  await connect();
  if (await User.findOne({ email })) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
  }
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hash });
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return NextResponse.json({ token }, { status: 201 });
}