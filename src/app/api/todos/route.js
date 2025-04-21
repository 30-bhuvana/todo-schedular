import { NextResponse } from 'next/server';
import jwt           from 'jsonwebtoken';

import { connect } from '../../../lib/mongo';

import Todo          from '../../../models/Todo';

async function getUserIdFromHeader(request) {
  const auth = request.headers.get('authorization')?.split(' ')[1];
  if (!auth) throw new Error('Unauthorized');
  const payload = jwt.verify(auth, process.env.JWT_SECRET);
  return payload.userId;
}

export async function GET(request) {
  const url = new URL(request.url);
  const dateParam = url.searchParams.get('date');
  const userId    = await getUserIdFromHeader(request);
  await connect();
  const start = new Date(dateParam);
  const end   = new Date(dateParam);
  end.setDate(end.getDate() + 1);
  const todos = await Todo.find({ owner: userId, dueDate: { $gte: start, $lt: end } });
  return NextResponse.json(todos);
}

export async function POST(request) {
  const { text, dueDate } = await request.json();
  const userId = await getUserIdFromHeader(request);
  await connect();
  const todo = await Todo.create({ owner: userId, text, dueDate });
  return NextResponse.json(todo, { status: 201 });
}

export async function DELETE(request) {
  const url = new URL(request.url);
  const id  = url.searchParams.get('id');
  const userId = await getUserIdFromHeader(request);
  await connect();
  await Todo.deleteOne({ _id: id, owner: userId });
  return new NextResponse(null, { status: 204 });

}