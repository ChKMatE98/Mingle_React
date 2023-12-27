import style from '../../pages/MyPage/Mypage.module.css';
import MyPageSideBarLeft from './components/MypageSidebarLeft/MypageSideBarLeft';
import Calculation from './Calculation/Calculation';
import MypageSidebarRight from './components/MypageSidebarRight/MypageSidebarRight';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import MypageMain from './MypageMain/MypageMain';
import MemberInfoUpdate from './MemberInfoUpdate/MemberInfoUpdate';
import PaymentManage from './PaymentManage/PaymentManage';
import PaymentRecord from './PaymentRecord/PaymentRecord';
import { createContext, useContext,useEffect,useState } from 'react';
import MypageHam from './components/MypageHam/MypageHam';
import { LoginContext, ModalContext } from '../../App';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import Denied from '../../components/Denied/Denied';

// sidebar에서 사용하는 컨텍스트
export const mypageMenuContext = createContext();

const Mypage= () => {

    // 로그인 컨텍스트
    const { loginId ,setLoginId } = useContext(LoginContext);

    console.log("마이페이지"+loginId);
    // sidebar로 넘겨주는 State
    const [menu, setMenu] = useState("");
    const navigate = useNavigate();

    // 드롭다운 메뉴 State (닫힘 :false, 열림: true)
    const [dropDown, setDropDown] = useState(true);
    

    // 로딩
    const [isLoading, setLoading] = useState(false);

    // on,off
    const ondropDownHandle = () =>{
        setDropDown(!dropDown);
    }
    console.log(loginId);

    // 서버로부터 loginID를 받아옴
    useEffect(()=>{
        setLoading(true);
        if(loginId){
            axios.get("/api/member/userBasicInfo").then((resp)=>{
                setLoginId(resp.data.loginID);
                setLoading(false);
            })
        }
        setLoading(false);
    },[loginId]);
    

    return(

        <>
            {
                !loginId ? (
                    isLoading ? (
                        <LoadingSpinner />
                    ):(
                        <Denied></Denied>
                    ) 

                ):(
                    <>
                    <mypageMenuContext.Provider value={{menu,setMenu}}>
                        <div className={style.container}>
                            <div className={style.dropDownNavi} onClick={ondropDownHandle}>
                                <MypageHam></MypageHam>
                            </div>
                            <div className={`${style.container__inner} ${!dropDown ? style.hidden : ''}`}>
                                <div >
                                    <MyPageSideBarLeft></MyPageSideBarLeft>
                                </div>
                                
                                <div>
                                
                                    <Routes>
                                        <Route path="/" element={<MypageMain/>}></Route>
                                        <Route path="Calculation" element={<Calculation/>}></Route>
                                        <Route path="MemberInfoUpdate" element={<MemberInfoUpdate/>}></Route>
                                        <Route path="PaymentManage" element={<PaymentManage/>}></Route>
                                        <Route path="PaymentRecord" element={<PaymentRecord/>}></Route>
                                    </Routes>
                                </div>
                                <div >
                                    <MypageSidebarRight></MypageSidebarRight>
                                </div>
                            </div>
                            
                        
                        </div>
                    </mypageMenuContext.Provider>
                </>
                )
            }
        
        
        </>
        
    );
}

export default Mypage;