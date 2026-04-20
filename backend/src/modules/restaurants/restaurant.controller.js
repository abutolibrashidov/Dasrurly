import RestaurantService from './restaurant.service.js';

class RestaurantController {
  async getInfo(req, res) {
    const restaurant = await RestaurantService.getRestaurantInfo(req.user.restaurantId);
    res.json(restaurant);
  }

  async update(req, res) {
    const restaurant = await RestaurantService.updateRestaurant(req.user.restaurantId, req.body);
    res.json(restaurant);
  }
}

export default new RestaurantController();
