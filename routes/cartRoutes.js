const express = require('express')
const router = express.Router();
const {prisma} = require("../db/config");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.post("/addProduct", async(req, res) => {
    const {userId, productId,count} = req.body;
    if (!userId || !productId || !count) {
        return res.status(404).send({error: "All fields required"});
    }
    try{
        const newP = await prisma.cart.create({
            data: {userId, productId, count}
        })
        return res.status(201).send(newP);
    }catch(err) {
        return res.status(500).send({error: "internal server error"});
    }
})

router.get("/getById/:id", async(req, res) => {
    const {id} = req.params;
    try{
        const pexist = await prisma.cart.findUnique({
            where: {cartId: Number(id)}
        })
        if (!pexist) {
            return res.status(404).send({error: "Cart not found"})
        }
        return res.status(200).send(pexist);
    }
    catch(err){
        return res.status(500).send({error: "internal server error"});
    }
})

router.patch("/patch/:id", async(req, res) => {
    const {id} = req.params;
    const {userId, productId,count} = req.body;
    try {
        const cart = await prisma.cart.update({
            where: {cartId: Number(id)},
            data: {
                count
            }
        })
        return res.status(200).send(cart);
    }
    catch(err) {
        return res.status(404).send({error: "Internal Server Error"})
    }
})

router.delete("/removeProduct/:id", async(req, res) => {
    const {id} = req.params;
    try {
        await prisma.cart.delete({
            where: {cartId: Number(id)}
        })
        return res.status(200).send({ message: "Cart deleted successfully" })
    }
    catch(err) {
        return res.status(404).send({error: "Deletion not happened successfully"})
    }
})






module.exports = router;