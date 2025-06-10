import { Request, Response } from "express";

export const farmerDashboard = async (req: Request, res: Response) => {
  res.send("Farmer Dashboard");
};

export const providerDashboard = async (req: Request, res: Response) => {
  res.send("Provider Dashboard");
};

export const RABDashboard = async (req: Request, res: Response) => {
  res.send("RAB Dashboard");
};
