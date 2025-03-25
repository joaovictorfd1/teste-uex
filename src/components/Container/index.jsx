export const Container = ({
  children
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px',
      borderRadius: '10px',
      background: '#fff'
    }}>
      {children}
    </div>
  );
}

export default Container;