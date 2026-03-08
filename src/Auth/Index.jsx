import styles from'./css/index_css.module.css'
import SigninSvg from '../assets/Signin.svg'

const Index =()=>{
    return (
    <div className={styles.container}>
        
            <img src={SigninSvg} className={styles.img}/>
            <div className={styles.left}>
                <div className={styles.head} >
                    <h2 className='h'>Welcome back</h2>
                    <p className={styles.small}>Sign In to your account</p>
                </div>

                <form className={styles.form}>
                    <label htmlFor="username">Username</label>
                    <input type="text" id='username' className={styles.input}/>
            
                    <label htmlFor="password">Password</label>
                    <input type="password" id='password' className={styles.input}/>
                <button className={styles.button}>Sign In</button>
                </form>
                <p>Don't have an account?<a>Sign up</a></p>
            
        </div>
</div>)}


export default Index