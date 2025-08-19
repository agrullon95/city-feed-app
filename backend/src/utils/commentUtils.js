const validateParentComment = async (prisma, postId, parentId) => {
  if (parentId === undefined || parentId === null) return null;

  const parsed = parseInt(parentId);
  if (Number.isNaN(parsed)) {
    throw new Error('Invalid parentId');
  }

  const parent = await prisma.comment.findUnique({ where: { id: parsed } });
  if (!parent) {
    throw new Error('Parent comment not found');
  }

  if (parent.postId !== postId) {
    throw new Error('Parent comment does not belong to this post');
  }

  if (parent.parentId !== null) {
    throw new Error('Replies to replies are not allowed');
  }

  return parsed;
};

module.exports = { validateParentComment };
