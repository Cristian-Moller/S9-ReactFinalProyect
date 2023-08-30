import { ReactComponent as InstagramIcon }from '../assets/svgs/Instagram.svg';
import { ReactComponent as GithubIcon }from '../assets/svgs/Github.svg';
import { ReactComponent as LinkedinIcon }from '../assets/svgs/Linkedin.svg';

function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="mx-auto w-full max-w-screen-2xl p-4 py-6 lg:py-8">
        <div className="flex justify-between items-center flex-col sm:flex-row">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center">
              <img src={('/src/assets/logo.png')} className="h-14 mr-3" alt="FlowBite Logo" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                <a href="#">
                  <img src="https://fontmeme.com/permalink/230822/b9a55d4a57cbd16fa42d57324bb65c88.png" alt="fuente-stage-oriental" className="border-0" /></a>
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-2">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Resources</h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a href="https://github.com/Cristian-Moller/S9-ReactFinalProyect" className="hover:underline ">Github</a>
                </li>
                <li>
                  <a href="https://www.barcelonactiva.cat/es/itacademy" className="hover:underline">IT Academy</a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Follow us</h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a href="https://www.linkedin.com/in/cristian-moller/" className="hover:underline ">LinkedIn</a>
                </li>
                <li>
                  <a href="https://github.com/Cristian-Moller" className="hover:underline">Github</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <div className="flex items-center sm:justify-between justify-between flex-col sm:flex-row">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2023 
            <a href="" className="hover:underline">
              Cristian Moller
            </a>. All Rights Reserved.
          </span>
          <div className="flex mt-4 space-x-5 sm:justify-center sm:mt-0">
            <a href="https://github.com/Cristian-Moller" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
              <GithubIcon/>
              <span className="sr-only">GitHub account</span>
            </a>
            <a className="text-gray-500 hover:text-gray-900 dark:hover:text-white" aria-label="Visit TrendyMinds LinkedIn" href="https://www.linkedin.com/in/cristian-moller" target="_blank">
              <LinkedinIcon/>
              <span className="sr-only">LinkedIn account</span>
            </a>
            <a className="text-gray-500 hover:text-gray-900 dark:hover:text-white" aria-label="Visit TrendyMinds LinkedIn" href="https://www.instagram.com/" target="_blank">
              <InstagramIcon />
              <span className="sr-only">Instagram account</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer