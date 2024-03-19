# Signup

1. Request truyền lên: `name, email, password`
```js
static signUp = async ({ name, email, password })
```
2. Kiểm tra email đó có tồn tại hay không
```js
const holderShop = await shopModel.findOne({ email }).lean();
```

3. Băm mật khẩu bằng bcrypt

```js
const passwordHash = await bcrypt.hash(password, 10);
```

4. Tạo shop trong ShopModel
```js
const privateKey = crypto.randomBytes(64).toString('hex');
const publicKey = crypto.randomBytes(64).toString('hex');
const newShop = await shopModel.create({
name,
email,
password: passwordHash,
roles: [RoleShop.SHOP],
});
```
5. Tạo cặp `publicKey` và `privateKey` bằng crypto
```js
const privateKey = crypto.randomBytes(64).toString('hex');
const publicKey = crypto.randomBytes(64).toString('hex');
```
6. Lưu cặp key vào KeyTokenModel
```js
const keyStore = await createKeyToken({
    userId: newShop._id,
    publicKey,
    privateKey,
});
```
7. Tạo cặp `accessToken`, `refreshToken` bằng `publicKey` và `privateKey` từ thừ viện JWT
  ```js
  const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days',
        });

        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days',
        });

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.log('error verify', err);
            } else {
                console.log('decode verify', decode);
            }
        });

        return { accessToken, refreshToken };
    } catch (error) {}
}
```
---
# Login

1. Req truyền lên `email, password, refreshToken = null`
```js
static login = async ({ email, password, refreshToken = null })
```
2. Kiểm tra email đó có tồn tại trong DB không
```js
const foundShop = await findByEmail({ email });
if (!foundShop) throw new BadRequestError('Shop not registered');
```
3. Kiểm tra mật khẩu có đúng với trong DB không
```js
const match = bcrypt.compare(password, foundShop.password);
if (!match) throw new AuthFailureError('Authentication Error');
```
4. Tạo cặp `publicKey`, `privateKey`
```js
const privateKey = crypto.randomBytes(64).toString('hex');
const publicKey = crypto.randomBytes(64).toString('hex');
```
5. Tạo Lưu tokens vào KeyTokenModal
```js
await KeyTokenService.createKeyToken({
    refreshToken: tokens.refreshToken,
    privateKey,
    publicKey,
    userId: foundShop._id,
});
```
---
# Authentication

1. Check `usedId` từ request truyền lên
```js
const userId = req.headers[HEADER.CLIENT_ID];
if (!userId) throw new AuthFailureError('Invalid Request');
```
2. Tìm ra `keyToken` từ `userId` đó trong `ShopTokenModel`
```js
const keyStore = await findByUserId(userId);
if (!keyStore) throw new NotFoundError('Not found key store');
```
3. Verify `accessToken` từ header với `publicKey` từ `keyStore` trong **DB**
```js
const accessToken = req.headers[HEADER.AUTHORIZATION];
if (!accessToken) throw new AuthFailureError('Invalid Request');
try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (decodeUser.userId !== userId) throw new AuthFailureError('Invalid User Id');
    req.keyStore = keyStore;
    return next();
} catch (error) {
    throw error;
}
```
---
# Logout

1. Nhận `keyStore` từ middleware `Authentication` và xóa nó trong `ShopTokenModel`
```js
static removeKeyById = async (id) => {
    return await keyTokenModel.deleteOne({ _id: new ObjectId(id) });
};
```
---
# Handler refresh token


Cart service
Nên tạo giỏ hàng ngay sau khi user đăng nhập không ??
Nếu Server đủ mạnh thì nên tạo giỏ hàng sẵn ngay sau khi người dùng đăng nhập, để tránh rủi ro của việc  tinh đồng thời cao duplicate




