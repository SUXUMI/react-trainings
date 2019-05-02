import React, { useState, useContext, useEffect } from 'react'
import { Query } from 'react-apollo'
import { gql } from 'apollo-boost'
import { Row, Col, Alert } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PageBar from './pageBar'
import Post from './post'
import MeContext from '../services/me-context'

const postsQuery = gql`
    query posts($page: Int = 0, $authorId: ID = null) {
        posts(page: $page, authorId: $authorId) {
            page
            totalPages
            list {
                _id title shortDescription commentsCount
                author { _id  firstName lastName}
            }
        }
    }
`

const Posts = ({history, location, match}) => {
    const initPage = 1

    const [page, setPage] = useState(initPage)
    const [postId, setPostId] = useState(null)
    const [authorId, setAuthorId] = useState(null)

    const { me } = useContext(MeContext)

    useEffect((me) => {
    // not visible `me` inside `useEffect`
    }, [])

    try {
        // console.log('me', me);
        if (me && location.pathname.split('/')[2] === 'me') {
            setAuthorId(me._id)
            // setPostId(null)
        }
    }
    catch(e) {}

    // ??? why above code renders multiple times

    return (
        <div>
            {!postId && <Query query={postsQuery} variables={{page, authorId}}>
                {({ data, loading }) => {
                    try {
                        const {posts: {totalPages, list}} = data

                        return (
                            <div>
                                {loading && <div className="loader"><FontAwesomeIcon icon="spinner" size="sm" spin title="loading.." /> Loading...</div>}

                                <ul className="posts-list">
                                    {!loading && list.map(post => (
                                    <li key={post._id}>
                                        <div className="title" onClick={() => { setPostId(post._id) }}> {post.title} </div>
                                        <div className="short-desc" onClick={() => { setPostId(post._id) }}> {post.shortDescription} </div>
                                        <Row>
                                            <Col sm="5" className="comments-count">comments ({post.commentsCount})</Col>
                                            <Col sm="7" className="author">author: {`${post.author.firstName} ${post.author.lastName}`}</Col>
                                        </Row>
                                    </li>
                                    ))}
                                </ul>

                                {totalPages > 1 && <PageBar currentPage={page} totalPages={totalPages} setPage={setPage} />}
                            </div>
                        )
                    }
                    catch(e) {
                        return <Alert color="danger">{e.message}</Alert>
                    }
                }}
            </Query>}

            {postId && <Post id={postId} />}
        </div>
    )
}

export default Posts