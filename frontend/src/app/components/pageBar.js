import React from 'react'
import { Button } from 'reactstrap'

const PageBar = ({currentPage, totalPages, setPage}) => {
    var list = []

    for (var i = 1; i <= totalPages; i++) { list.push(i) }

    return (
        <div className="pageBar">
            {list.map((i) => {
                return (
                    i === currentPage ?
                        <Button key={i} color="primary" size="sm" disabled>{i}</Button> :
                        <Button key={i} color="danger" size="sm" onClick={() => { setPage(i) }}>{i}</Button>
                )
            })}
        </div>
    )
}

export default PageBar