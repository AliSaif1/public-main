import multer from 'multer';
import express from 'express';
import { saveInfluencerInfo } from '../controllers/influencerController.js';
import { saveInfluencerIn } from '../controllers/influencerControllers.js';
import { getDeals, getDealsByUserID , getApprovedDeals, getContractDetails, acceptContract } from '../controllers/deals.js';
import { addProposal, deleteProposal } from '../controllers/proposalController.js';
import { getUserContracts, getContractByProposalID, sendDraft, approveCancelRequest, rejectCancelRequest } from '../controllers/contractController.js';
import { uploadMedia, getMedia, editMedia, submitInstaLinks } from '../controllers/MediaController.js';
import { getInstaMediaByUserId } from '../controllers/instaMediacontroller.js';
import { addPaymentAccount, getPaymentAccounts } from '../controllers/withdrawalController.js';

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();
router.post('/influencerInfo', upload.single('photo'), saveInfluencerInfo);
router.post("/Brand", upload.single("logo"), saveInfluencerIn);
router.get("/deals", getDeals);
router.get("/getDealsByUserID", getDealsByUserID);
router.get('/getApprovedDeals', getApprovedDeals);
router.post("/addProposal", addProposal);
router.get("/getUserContracts", getUserContracts);
router.get('/getContractByProposalID', getContractByProposalID);
router.post('/upload', upload.single('media'), uploadMedia);
router.get('/media', getMedia);
router.get('/instaMedia', getInstaMediaByUserId);
router.put('/sendDraft/:contractID', sendDraft);
router.get('/getContractDetails/:contractID', getContractDetails);
router.put('/acceptContract/:contractID', acceptContract);
router.put('/deleteProposal/:dealID', deleteProposal);
router.put('/editMedia', upload.single('media'), editMedia);
router.post('/submitInstaLinks', submitInstaLinks);
router.put('/approveCancelRequest/:contractID', approveCancelRequest);
router.put('/rejectCancelRequest/:contractID', rejectCancelRequest);
router.post('/addPaymentAccount', addPaymentAccount);
router.get('/getPaymentAccounts', getPaymentAccounts);

export default router;