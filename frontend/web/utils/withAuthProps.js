import { getServerUser } from './getServerUser';

export function withAuthProps(handler) {
  return async (context) => {
    const initialUser = await getServerUser(context.req);
    const result = await handler(context);
    return {
      props: {
        ...result.props,
        initialUser,
      },
    };
  };
}
