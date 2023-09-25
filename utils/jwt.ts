import jwt from "jsonwebtoken";

export const createToken = (payload: any): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "90d",
  });
};

// verify token and its expiration
export function verifyToken(req: any, res: any, next: any) {
  let token = req.headers["authorization"];
  console.log(token);

  if (!token) {
    return res.status(401).send({ message: "No token provided" });
  }

  //remove Bearer from token
  token = token.slice(7, token.length);

  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    (err: any, decoded: any) => {
      if (err) {
        return res.status(401).send({ message: err });
      }
      req.userId = decoded.id;
      next();
    }
  );
}
