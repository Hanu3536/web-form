import { makeStyles} from '@mui/styles'

const useStyles = makeStyles({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f0f0', 
        marginLeft: '20px',
    },

    textField: {
        width: '300px',
    },
    title: {
        alignItems: 'center',
        marginRight: '50px',
    },
    button: {
        width: '600px',
        backgroundColor: '#003366',
        color: '#ffffff',
        '&:hover': {
            backgroundColor: '#FCBA19', color: 'black',
        },
    }
});
export default useStyles;