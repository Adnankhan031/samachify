-- Phase 4: add Razorpay payment columns to orders.
-- Run this in Supabase → SQL Editor once, before enabling online payments.
-- Safe to re-run.

alter table public.orders
  add column if not exists razorpay_payment_id text,
  add column if not exists razorpay_order_id text;
