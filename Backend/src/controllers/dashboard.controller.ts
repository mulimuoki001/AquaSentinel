import { Response } from "express";
import { AuthenticatedRequest } from "../types/types";

export const farmerDashboard = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const farmerData = req.userData;
  res.send(farmerData);
};

export const providerDashboard = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userData = req.userData;
  res.send(userData);
};

export const RABDashboard = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userData = req.user;
  console.log(req.user);
  console.log("userData:", userData);
  res.send(userData);
};
