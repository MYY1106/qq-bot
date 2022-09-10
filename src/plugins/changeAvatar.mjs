export default (client, src = "src/assets/avatar.png") => {
    client.setAvatar(src)
        .then(() => console.log('更换头像成功'))
        .catch(e => { console.log(e) })
}