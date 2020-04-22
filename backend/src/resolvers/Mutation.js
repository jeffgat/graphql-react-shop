const Mutations = {
  async createItem(parent, args, ctx, info) {
    //TODO: check if they are logged in

    const item = await ctx.db.mutation.createItem({ // ctx.db.mutatuion returns a PROMISE, so we ASYNC it
      data: {
        ...args // same as individually pulling items from args
      }
    }, info)

    console.log(item);
    return item
  }
  // createDog(parent, args, ctx, info) {
  //   // create a dog
  //   global.dogs = global.dogs || []
  //   const newDog = { name: args.name }
  //   global.dogs.push(newDog);
  //   return newDog;
  // }
};

module.exports = Mutations;
