const faker = require('faker')
const bcrypt = require('bcrypt-nodejs')
const UserModel = require('../models/user')
const PostModel = require('../models/post')
const CommentModel = require('../models/comment')

const randomMinMaxInt = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

const fakeUsersCount = 10;
const fakePassword = 123;

UserModel
    .find(null, '_id')
    .exec()
    .then(async function(result) {
        try {
            // if no records, enter fake data
            if (!result.length) {
                for (i = 1; i <= fakeUsersCount; i++) {
                    let user = new UserModel({
                        firstName: faker.name.firstName(),
                        lastName: faker.name.lastName(),
                        email: 'test' + i + '@test.com',
                        password: bcrypt.hashSync(fakePassword, bcrypt.genSaltSync(8)),
                    })

                    await user.save();

                    // generate posts
                    let randomPostsCount = randomMinMaxInt(0, 7);

                    for (j = 0; j < randomPostsCount; j++) {
                        // save post
                        let post = new PostModel({
                            title: faker.lorem.words(randomMinMaxInt(2, 5)),
                            description: faker.lorem.sentences(randomMinMaxInt(20, 50)),
                            userId: user._id,
                        })

                        await post.save();

                        // generate comments
                        let randomCommentsCount = randomMinMaxInt(0, 7);

                        for (k = 0; k < randomCommentsCount; k++) {
                            let comment = new CommentModel({
                                authorName: faker.name.firstName(),
                                comment: faker.lorem.sentence(),
                                postId: post._id,
                            })

                            comment.save()
                        }
                    }
                }
            }

        }
        catch(e) {
            console.log('Error:', e.message);
        }
    })