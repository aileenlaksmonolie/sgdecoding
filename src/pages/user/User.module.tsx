import { Route, Routes } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import NotFoundPage from "../authentication/NotFoundPage";
import ResetPasswordPage from "../authentication/ResetPasswordPage";
import ChangeNamePage from "./ChangeNamePage";
import ChangePasswordPage from "./ChangePasswordPage";
import LiveDecodePage from "./LiveDecodePage";
import OfflineTranscribePage from "./offline-transcribe-page";
import OverviewPage from "./OverviewPage";
import ProfilePage from "./ProfilePage";


const UserModule: React.FC = () => {

	return (
		<Layout>
			<Routes>
				<Route path='/' element={<OverviewPage />}></Route>	
				<Route path='overview' element={<OverviewPage />}></Route>	
				<Route path='livetranscribe' element={<LiveDecodePage />}></Route>	
				<Route path='offlinetranscribe' element={<OfflineTranscribePage />}></Route>	
				<Route path='profile' element={<ProfilePage />}></Route>	
				<Route path='changepassword' element={<ChangePasswordPage />}></Route>
				<Route path='changename' element={<ChangeNamePage />}></Route>
				<Route path='*' element={<NotFoundPage />}></Route>
			</Routes>
		</Layout>
	);
}

export default UserModule