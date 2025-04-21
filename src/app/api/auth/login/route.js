import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt    from 'jsonwebtoken';


import { connect } from '../../../../lib/mongo';

import User   from '../../../../models/User';

export async function POST(request) {
  const { email, password } = await request.json();
  await connect();
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return NextResponse.json({ token });
}