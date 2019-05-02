import React, { useState, useContext } from 'react'
import { useQuery, useMutation } from 'react-apollo-hooks'
import { gql } from 'apollo-boost'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Form, FormGroup, Input, Button, Alert } from 'reactstrap'
import MeContext from '../services/me-context'

const postQuery = gql`
  query postById($id: ID!) {
    post: postById(id: $id) {
      _id title description created
      author {
        _id firstName lastName email
      }
      comments {
        _id authorName comment created
      }
      commentsCount
    }
  }
`

const commentMutation = gql`
  mutation comment($postId: ID!, $authorName: String!, $comment: String!) {
    comment(data: {
      postId: $postId
      authorName: $authorName
      comment: $comment
    }) {
      _id authorName comment created
    }
  }
`

const Post = ({ id }) => {
  const { data: { post }, loading, error } = useQuery(postQuery, {
    variables: { id },
    fetchPolicy: 'no-cache' // 'cache-and-network'
  })

  // ??? NOT WORKS
  // const [insertComment] = useMutation(commentMutation)

  const insertComment = useMutation(commentMutation)

  // ??? why called 3 times ???
  // console.log(id);
  // console.log('loading: ', loading);

  const { me } = useContext(MeContext)

  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [values, setValue] = useState({postId: id, authorName: me ? me.firstName + me.lastName : '', comment: ''})
  const [postComments, setPostComments] = useState([])

  const setMyValue = event => {
    const name = event.target.name
    const value = event.target.value

    setValue({
      ...values,
      [name]: value
    })
  }
  
  const submit = async event => {
    event.preventDefault()

    setSubmitting(true);

    try {
      const result = await insertComment({
        variables: {
          postId: values.postId, 
          authorName: values.authorName, 
          comment: values.comment
        },
        fetchPolicy: 'no-cache' // 'cache-and-network'
      })

      console.log('result.data:', result.data.comment);

      const { _id, authorName, comment, created } = result.data.comment

      console.log(_id, authorName, comment, created);

      // ??? Unable to grab real error message from response
      
      setValue({
        ...values,
        comment: ''
      })

      // !!! unable to use setPostComments
      // if no error, append comment `გლეხურად 🙂`

      const el = document.getElementById('comments');
      let newCommentHtml = document.getElementById('comment-template').innerHTML
      console.log('newCommentHtml:', newCommentHtml);
      newCommentHtml = newCommentHtml.replace('key_="{id}"', 'key_="' + _id + '"')
      newCommentHtml = newCommentHtml.replace('{authorName}', authorName)
      newCommentHtml = newCommentHtml.replace('{comment}', comment)
      newCommentHtml = newCommentHtml.replace('{date}', (new Date(parseInt(created))).toLocaleDateString())

      el.innerHTML = newCommentHtml + el.innerHTML
    }
    catch(e) {
      console.log('e', e);

      setSubmitError(e.message)
    }
    finally {
      setSubmitting(false);
    }

    setTimeout(() => { setSubmitError('') }, 3000)
  }
  

  
  if (error) {
    return <div>Something goes wrong</div>
  }

  if (loading || typeof(post) == 'undefined') {
    return (<FontAwesomeIcon icon="spinner" size="sm" spin title="loading.."> loading..</FontAwesomeIcon>)
  }

  // !!! setPostComments(post.comments)
  // console.log('post.comments:', post.comments);
  // console.log('postComments', postComments);

  return (
    <div>
      <div className="post">
        <h2 className="title">{post.title}</h2>
        <div className="author">by: {`${post.author.firstName} ${post.author.lastName}`}</div>
        <div className="date">published on: {(new Date(parseInt(post.created))).toLocaleDateString()}</div>
        <div className="date">{post._id}</div>
        <div className="description">{post.description}</div>
      </div>

      {submitError && (<Alert color="danger">{submitError}</Alert>)}

      <Form onSubmit={submit} className="commentForm">
        {error && (<Alert color="danger">{error}</Alert>)}

        <FormGroup>
            <Input name="authorName" value={values.authorName} onChange={setMyValue} placeholder="your name" required />
        </FormGroup>

        <FormGroup>
          <Input type="textarea" name="comment" value={values.comment} onChange={setMyValue} placeholder="Enter your comment here" required />
        </FormGroup>

          <Button disabled={submitting} className="btn-sm">
            {submitting ? <span><FontAwesomeIcon icon="spinner" size="sm" spin title="loading.." /> submitting..</span> : 'leave your comment'}
          </Button>
      </Form>

      <div className="comments" id="comments">
      {/* !!! ??? infinite loop ??? */}
      {/* {postComments && (() => { console.log('postComments2:', postComments); return <div>...</div>}) && postComments.map(({_id, authorName, comment, created}) => ( */}
      {post.comments && post.comments.map(({_id, authorName, comment, created}) => (
      <div key={_id} className="comment">
        <div>
          <span className="author">{authorName}</span> &nbsp;
          <span className="date">({(new Date(parseInt(post.created))).toLocaleDateString()})</span>
        </div>
        <div className="message">{comment}</div>
      </div>
      ))}

      <div id="comment-template" style={{display: 'none'}}>
        <div key_="{id}" className="comment">
          <div>
            <span className="author">{"{authorName}"}</span> &nbsp;
            <span className="date">{"{date}"}</span>
          </div>
          <div className="message">{"{comment}"}</div>
        </div>
      </div>

      </div>

    </div>
  )
}

export default Post
