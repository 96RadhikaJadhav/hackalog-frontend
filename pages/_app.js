import 'bootstrap/dist/css/bootstrap.min.css'
import '../css/font.css'
import '../css/style.css'
import '../css/misc.css'

import { ThemeProvider, StyleReset } from 'atomize'
import { Provider as StyletronProvider } from "styletron-react"
import { styletron, debug } from '../context/styletron'
import Head from 'next/head'

import { AuthProvider } from '../context/auth'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'

const theme = {
	fontFamily: {
		primary: "madetommy-regular, Raleway, serif",
	},
}

function MyApp({ Component, pageProps }) {
	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>
			<StyletronProvider value={styletron} debug={debug} debugAfterHydration>
				<ThemeProvider theme={theme}>
					<StyleReset />
					<AuthProvider>
						<Header />
						<div style={{paddingTop: "88px"}}>
							<Component {...pageProps} />
							<Footer />
						</div>
					</AuthProvider>
				</ThemeProvider>
			</StyletronProvider>
		</>
	)
}

export default MyApp
