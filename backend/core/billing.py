import stripe
from django.conf import settings

def init_stripe():
    if not settings.STRIPE_SECRET_KEY:
        raise RuntimeError("STRIPE_SECRET_KEY not set")
    stripe.api_key = settings.STRIPE_SECRET_KEY

def create_checkout_session(user_id: int):
    init_stripe()
    if not settings.STRIPE_PRICE_ID:
        raise RuntimeError("STRIPE_PRICE_ID not set")
    session = stripe.checkout.Session.create(
        mode="subscription",
        line_items=[{"price": settings.STRIPE_PRICE_ID, "quantity": 1}],
        success_url=f"{settings.FRONTEND_BASE_URL}/?upgrade=success",
        cancel_url=f"{settings.FRONTEND_BASE_URL}/?upgrade=cancel",
        metadata={"user_id": str(user_id)},
    )
    return session

def parse_webhook(payload: bytes, sig: str):
    init_stripe()
    whsec = settings.STRIPE_WEBHOOK_SECRET
    event = stripe.Webhook.construct_event(payload, sig, whsec)
    return event

