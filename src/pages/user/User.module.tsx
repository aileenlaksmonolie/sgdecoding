import { Route, Routes } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import LiveTranscribePage from "./LiveTranscribePage";
import OverviewPage from "./OverviewPage";
import ViewAllOfflineJobsPage from "./ViewAllOfflineJobsPage";


const UserModule: React.FC = () => {

	return (
		<Layout>
			<Routes>
				<Route path='overview' element={<OverviewPage />}></Route>	
				<Route path='livetranscribe' element={<LiveTranscribePage />}></Route>	
				<Route path='viewalljobs' element={<ViewAllOfflineJobsPage />}></Route>	
			</Routes>
		</Layout>
	);
}

export default UserModule