import { Link } from 'react-router-dom';
import type { JSX } from 'react/jsx-runtime';

export function TopPage(): JSX.Element {
    return (
        <div className='w-full h-[38%] flex flex-row items-center justify-center'>
            <Link to='/pages/register/' className='h-full w-[18%]'>
                <div className='header-tab mr-[2%]'>Register</div>
            </Link>
        </div>
    );
}