let createEntry = (dbconfig, user, category, thread) => {
  return new Promise((resolve, reject) => {
    dbconfig.UserTitle.create({ name: 'Member', color: '#CCCCCC' })
      .then(title => dbconfig.User.create({
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        titles: [title._id]
      })
      .then(user => dbconfig.Category.create(category)
      .then(category => dbconfig.Thread.create({
        category: category._id,
        name: thread.name,
        content: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
        author: user._id
      }).then(thread => dbconfig.Comment.create({
        thread: thread._id,
        author: user._id,
        content: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?'
      }).then(result => resolve())))))
      .catch(err => console.log(err))
  })
}

export const create = (dbconfig) => {
  return createEntry(dbconfig, {
    name: 'Tyler',
    email: 'sedlarizona@gmail.com',
    avatar: 'https://secure.gravatar.com/avatar/d8a1a8cc4a20bbcd3e40cd18c50e7c73?s=150&d=identicon'
  }, {
    icon: '/images/announcements.png',
    icon_color: '#E57373',
    name: 'Announcements',
    description: 'Community Announcements'
  }, {
    name: 'Initial release!!'
  }).then(createEntry(dbconfig, {
    name: 'Jacob',
    email: 'jdoiron@smcm.edu',
    avatar: 'https://lh4.googleusercontent.com/-VDj35vv0BzQ/VOeUoyJ_bWI/AAAAAAAACT8/8sR_1NrJeX0WFULuqyYawWgtDM0j2pbQACL0B/s1392-no/fe90957e-73ff-44bf-a9a5-e3477417db65'
  }, {
    icon: '/images/announcements.png',
    icon_color: '#00BFFF',
    name: 'Discussions',
    description: 'General Conversations'
  }, {
    name: 'How is everyone\'s Thursday?'
  }))
}
