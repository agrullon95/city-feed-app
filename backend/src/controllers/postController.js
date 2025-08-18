const { content, tags, city, country, anonymous } = req.body;

const post = await prisma.post.create({
  data: {
    content,
    tags: tags || [],
    city: city || null,
    country: country || null,
    anonymous: anonymous || false,
    authorId: anonymous ? null : req.user.id
  }
});

module.exports = { post };
