import React, { Fragment } from 'react'
import { Link } from 'react-router-dom';
import { Badge, Button } from 'reactstrap';

const Category = ({posts}) => {
    console.log("posts",posts);
    // category 넘어가는 saga
    // server쪽에서 카테고리로 검색되도록 해야함
    return (
        <Fragment>
            {
                Array.isArray(posts)?
                    posts.map(({_id, categoryName, posts}) => {
                        return(
                        <div key={_id} className="mx-1 mt-1 my_category">
                            <Link 
                                to={`/posts/category/${categoryName}`} 
                                className="text-dark text-decoration-none"
                            >
                                <span className = "ml-1">
                                    <Button color="info">
                                        {categoryName}{" "}
                                        <Badge color="light">{posts.length}</Badge>
                                    </Button>
                                </span>
                            </Link>
                        </div>
                    )}) : ""
            }
        </Fragment>
    );
}
export default Category;

/*
둘이 같은 것이었음
posts.map(({_id, categoryName, posts}) => { return() })
posts.map(({_id, categoryName, posts}) => ())
*/