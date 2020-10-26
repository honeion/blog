//redux-saga 관련 파일 저장
import {all} from 'redux-saga/effects'

export default function* rootSaga() {
    yield all([]);
}
//function* 이 함수는 generator 함수(여러값을 반환할 수 있음)
//[] 안에 필요할 때마다 여러 값을 불러올 수 있도록 함
