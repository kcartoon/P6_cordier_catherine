const emailMask2Options = {
    maskWith: '*',
    unmaskedStartCharactersBeforeAt: 3,
    unmaskedEndCharactersAfterAt: 2,
    maskAtTheRate: false,
};

const email = req.body.email;

const maskedEmail = MaskData.maskEmail2(email, emailMask2Options);