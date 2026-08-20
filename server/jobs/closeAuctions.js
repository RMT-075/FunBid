const { Op } = require('sequelize');
const { Product, User } = require('../models');

async function closeEndedAuctions(io) {
  const now = new Date();

  const expiredProducts = await Product.findAll({
    where: {
      status: 'live',
      end_time: { [Op.lte]: now },
    },
  });

  for (const product of expiredProducts) {
    product.status = 'ended';
    await product.save();

    const winner = product.winner_id
      ? await User.findByPk(product.winner_id, {
          attributes: ['id', 'name', 'email'],
        })
      : null;

    if (io) {
      io.to(`product:${product.id}`).emit('auctionEnded', {
        productId: product.id,
        finalPrice: product.current_price,
        winner,
      });
    }

    console.log(
      `[auction] produk #${product.id} ditutup. pemenang: ${
        winner ? winner.name : 'tidak ada bidder'
      }`
    );
  }
}


async function closeIfExpired(product, io) {
  if (product.status !== 'live') return product;

  const now = new Date();
  if (product.end_time > now) return product;

  product.status = 'ended';
  await product.save();

  if (io) {
    const winner = product.winner_id
      ? await User.findByPk(product.winner_id, {
          attributes: ['id', 'name', 'email'],
        })
      : null;

    io.to(`product:${product.id}`).emit('auctionEnded', {
      productId: product.id,
      finalPrice: product.current_price,
      winner,
    });
  }

  return product;
}


async function openStartedAuctions(io) {
  const now = new Date();

  const startedProducts = await Product.findAll({
    where: {
      status: 'upcoming',
      start_time: { [Op.lte]: now },
    },
  });

  for (const product of startedProducts) {
    product.status = 'live';
    await product.save();

    if (io) {
      io.to(`product:${product.id}`).emit('auctionStarted', {
        productId: product.id,
        status: product.status,
      });
    }

    console.log(`[auction] produk #${product.id} mulai live.`);
  }
}


async function openIfStarted(product, io) {
  if (product.status !== 'upcoming') return product;

  const now = new Date();
  if (product.start_time > now) return product;

  product.status = 'live';
  await product.save();

  if (io) {
    io.to(`product:${product.id}`).emit('auctionStarted', {
      productId: product.id,
      status: product.status,
    });
  }

  return product;
}

module.exports = {
  closeEndedAuctions,
  closeIfExpired,
  openStartedAuctions,
  openIfStarted,
};