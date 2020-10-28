import React from 'react'
import { Row, Col } from "reactstrap"

const Header = () => {
    return (
        <div id="page-header" className="mb-3">
            <Row>
                <Col sm="auto" md="6" className="text-center m-auto">
                    <h1>Read My Blog</h1>
                    <p>Honeion의 사이드 프로젝트 작업 블로그입니다.</p>

                </Col>
                
            </Row>
        </div>
    )
};

export default Header;