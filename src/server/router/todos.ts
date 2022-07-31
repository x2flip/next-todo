import { createRouter } from './context';
import { number, z } from 'zod';
import { createProtectedRouter } from './protected-router';

export const todosRouter = createProtectedRouter()
    .query('getAll', {
        async resolve({ ctx }) {
            return await ctx.prisma.todo.findMany({
                where: { userId: ctx.session.user.id },
            });
        },
    })
    .mutation('addTodo', {
        input: z.object({ todo: z.string() }),
        async resolve({ input, ctx }) {
            let { session } = ctx;
            let { user } = session;
            if (user.id === undefined) {
                return;
            } else {
                return await ctx.prisma.todo.create({
                    data: { ...input, userId: ctx.session.user.id ?? '' },
                });
            }
        },
    })
    .mutation('updateTodo', {
        input: z.object({
            id: z.number(),
            complete: z.boolean().optional(),
            todo: z.string().optional(),
            dueDate: z.date().optional(),
        }),
        async resolve({ input, ctx }) {
            return await ctx.prisma.todo.update({
                where: { id: input.id },
                data: { ...input },
            });
        },
    })
    .mutation('deleteTodo', {
        input: z.object({ id: number() }),
        async resolve({ input, ctx }) {
            return await ctx.prisma.todo.delete({ where: { id: input.id } });
        },
    });
