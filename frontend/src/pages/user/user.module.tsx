import { Route, Routes } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import NotFoundPage from "../authentication/not-found.page";
import ChangeNamePage from './change-name.page';
import ChangePasswordPage from "./change-password.page";
import LiveDecodePage from "./live-decode.page";
import OfflineTranscribePage from "./offline-transcribe-page";
import OverviewPage from "./overview.page";
import ProfilePage from "./profile.page";
import ViewOneTranscript from "./view-one-transcript";


const UserModule: React.FC = () => {

	return (
		<Layout>
			<Routes>
				<Route path='/' element={<OverviewPage />}></Route>	
				<Route path='overview' element={<OverviewPage />}></Route>	
				<Route path='livetranscribe' element={<LiveDecodePage />}></Route>	
				<Route path='offlinetranscribe' element={<OfflineTranscribePage />}></Route>	
				<Route path='viewonetranscript' element={<ViewOneTranscript />}></Route>	
				<Route path='profile' element={<ProfilePage />}></Route>	
				<Route path='changepassword' element={<ChangePasswordPage />}></Route>
				<Route path='changename' element={<ChangeNamePage />}></Route>
				<Route path='*' element={<NotFoundPage />}></Route>
			</Routes>
		</Layout>
	);
}

export default UserModule